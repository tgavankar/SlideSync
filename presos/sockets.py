from django.conf import settings

import redis
from socketio.namespace import BaseNamespace


class RoomsMixin(object):
    def __init__(self, *args, **kwargs):
        self.redis = redis.StrictRedis(settings.REDIS_HOST)

    def join(self, room):
        """Lets a user join a room on a specific Namespace."""
        self.redis.sadd('rooms', self._get_room_name(room))

    def leave(self, room):
        """Lets a user leave a room on a specific Namespace."""
        self.redis.srem('rooms', self._get_room_name(room))

    def _get_room_name(self, room):
        return self.ns_name + '_' + room

    def emit_to_room(self, room, event, *args):
        """This is sent to all in the room (in this particular Namespace)"""
        pkt = dict(type="event",
                   name=event,
                   args=args,
                   endpoint=self.ns_name)
        room_name = self._get_room_name(room)
        for sessid, socket in self.socket.server.sockets.iteritems():
            if self.redis.sismember('rooms', room_name) and self.socket != socket:
                socket.send_packet(pkt)


class PresentNamespace(BaseNamespace, RoomsMixin):
    def on_view(self, room):
        print 'joining room %s' % room
        self.room = room
        self.join(room)
        return True

    def on_send(self, msg):
        print 'emitting %s to %s' % (msg, self.room)
        self.emit_to_room(self.room, 'receive', msg)
        return True